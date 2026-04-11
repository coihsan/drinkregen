'use client'

import React, { useId, useMemo, useState } from 'react'
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Label } from '@workspace/ui/components/label'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { getColor, getText, passwordRequirements } from '@/lib/helpers'

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  containerClassName?: string;
}

const PasswordRequirement = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, containerClassName, className, id: customId, value, onChange, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    const generatedId = useId()
    const id = customId || generatedId

    const [internalValue, setInternalValue] = useState(value?.toString() || '')

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value)
      if (onChange) {
        onChange(e)
      }
    }

    const currentPassword = value !== undefined ? String(value) : internalValue

    const toggleVisibility = (e: React.MouseEvent) => {
      e.preventDefault()
      setIsVisible(prevState => !prevState)
    }

    const strength = passwordRequirements.map(req => ({
      met: req.regex.test(currentPassword),
      text: req.text
    }))

    const strengthScore = useMemo(() => {
      return strength.filter(req => req.met).length
    }, [strength])

    return (
      <div className={cn('w-full space-y-2', containerClassName)}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className='relative mb-3'>
          <Input
            id={id}
            ref={ref}
            type={isVisible ? 'text' : 'password'}
            value={value}
            onChange={handlePasswordChange}
            className={cn('pr-9', className)}
            {...props}
          />
          <Button
            type="button" 
            variant='ghost'
            size='icon'
            onClick={toggleVisibility}
            className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
          >
            {isVisible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            <span className='sr-only'>{isVisible ? 'Hide password' : 'Show password'}</span>
          </Button>
        </div>

        <div className='mb-4 flex h-1 w-full gap-1'>
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className={cn(
                'h-full flex-1 rounded-full transition-all duration-500 ease-out',
                index < strengthScore ? getColor(strengthScore) : 'bg-border'
              )}
            />
          ))}
        </div>

        <p className='text-foreground text-sm font-medium'>{getText(strengthScore)}. Must contain:</p>

        <ul className='mb-4 space-y-1.5'>
          {strength.map((req, index) => (
            <li key={index} className='flex items-center gap-2'>
              {req.met ? (
                <CheckIcon className='size-4 text-green-600 dark:text-green-400' />
              ) : (
                <XIcon className='text-muted-foreground size-4' />
              )}
              <span className={cn('text-xs', req.met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground')}>
                {req.text}
                <span className='sr-only'>{req.met ? ' - Requirement met' : ' - Requirement not met'}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
)

PasswordRequirement.displayName = 'PasswordRequirement'

export default PasswordRequirement