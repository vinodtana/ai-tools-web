import AuthForm from '@/components/AuthForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <AuthForm onAuthenticated={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
