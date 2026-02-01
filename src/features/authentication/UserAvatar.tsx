import styled from "styled-components";
import { useUser } from "./useUser";
import Modal from "../../ui/Modal";

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  width: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    z-index: 10;
    cursor: pointer;
  }
`;

function UserAvatar() {
  const { user } = useUser();
  const { avatar, fullName } = user?.user_metadata || {};

  return (
    <StyledUserAvatar>
      <Modal>
        <Modal.Open opens="Avatar">
          <Avatar
            src={avatar || "default-user.jpg"}
            alt={`Avatar of ${fullName}`}
          ></Avatar>
        </Modal.Open>
        <Modal.Window name="Avatar">
          <img
            src={avatar ?? undefined}
            style={{ width: "100%", objectFit: "contain" }}
          />
        </Modal.Window>
      </Modal>
      <span>{fullName}</span>
    </StyledUserAvatar>
  );
}

export default UserAvatar;
