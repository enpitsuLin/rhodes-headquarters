import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { IntrinsicElementAttributes } from 'vue'

const buttonVariants = cva(
  'inline-flex items-center justify-center relative',
  {
    variants: {
      variant: {
        'default': 'border color-foreground border-border hover:color-black hover:bg-primary hover:border-primary transition-colors duration-300',
        'ghost': 'bg-background/10 c-foreground hover:bg-primary/65 transition-colors duration-300',
        'animate-outline': 'group color-foreground hover:color-primary',
      },
      size: {
        default: 'h-10 px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ButtonProps {
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  as?: Component | keyof IntrinsicElementAttributes
}

export { buttonVariants, ButtonProps }
