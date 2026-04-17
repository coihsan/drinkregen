import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoginForm from "../../components/login-form"

test('Page', () => {
  render(typeof LoginForm)
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
})