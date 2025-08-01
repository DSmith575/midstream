import { Button } from '@/components/ui/button'

interface ChangeUserRoleButtonProps {
  text: String
  onClick: () => void
  buttonText: string
}

export const DevToolButton = ({ onClick, text, buttonText }: ChangeUserRoleButtonProps) => {
  return (
    <div className={'col-span-1 flex flex-col'}>
      <p className={'flex justify-center'}>{text}</p>
      <Button className={'bg-green-500 hover:bg-[#59b5e1]'} onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  )
}
