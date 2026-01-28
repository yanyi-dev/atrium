import Button from "../../ui/Button";
import { useCheckout } from "./useCheckout";

interface CheckoutButtonProps {
  bookingId: number;
}

function CheckoutButton({ bookingId }: CheckoutButtonProps) {
  const { checkout, isCheckingout } = useCheckout();

  return (
    <Button
      $variation="primary"
      $size="small"
      onClick={() => checkout(bookingId)}
      disabled={isCheckingout}
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;
