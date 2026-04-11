'use client'

import { useId, useState } from 'react'

import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Label } from '@workspace/ui/components/label'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'

interface PasswordVisible {
    withLabel?: boolean;
    labelName?: string;
    value: string;
    placeholder?: string,
    className?: string
    onChange?: (event: any) => void
    disabled?: boolean
}

const PasswordVisible = ({withLabel,labelName, value, placeholder, className, disabled, onChange, ...props} : PasswordVisible) => {
  const [isVisible, setIsVisible] = useState(false)

  const id = useId()

  return (
    <div className='w-full max-w-xs space-y-2'>
      {withLabel && <Label htmlFor={id}>{labelName}</Label>}
      <div className='relative'>
        <Input disabled={disabled} onChange={onChange} {...props} value={value} id={id} type={isVisible ? 'text' : 'password'} placeholder={placeholder} className={`pr-9 ${className}`} />
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setIsVisible(prevState => !prevState)}
          className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          <span className='sr-only'>{isVisible ? 'Hide password' : 'Show password'}</span>
        </Button>
      </div>
    </div>
  )
}

export default PasswordVisible
