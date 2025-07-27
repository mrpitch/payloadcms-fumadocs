'use client'
import { ArrayField, Button } from '@payloadcms/ui'
export const Test = () => {
  return (
    <div>
      <h1>Test</h1>
      <Button buttonStyle="pill" onClick={() => console.log('clicked')}>
        Click me
      </Button>
    </div>
  )
}
