import {
  Root,
  Trigger as DialogTrigger,
  Portal,
  Overlay,
  Content,
} from "@radix-ui/react-dialog";

import styles from "./Dialog.module.scss";

interface DialogProps {
  trigger: React.ReactNode;
  open: boolean;
  onOpenChange: () => void;
  children: React.ReactNode;
  title?: string;
}
const Dialog = ({
  trigger: Trigger,
  open,
  onOpenChange,
  children,
}: DialogProps) => {
  return (
    <Root open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <Portal>
        <Overlay className={styles.overlay} />
        <Content className={styles.content}>{children}</Content>
      </Portal>
    </Root>
  );
};

export default Dialog;
