import styled from "styled-components";

import { formatCurrency } from "../../utils/helpers";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";

import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import CreateCabinForm from "./CreateCabinForm";
import { useDeleteCabin } from "./useDeleteCabin";
import { useCreateCabin } from "./useCreateCabin";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { Cabin as CabinProp } from "../../types";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
  transition: all 0.2s;

  &:hover {
    transform: scale(1.6);
    z-index: 10;
    cursor: pointer;
  }
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

interface CabinRowProps {
  cabin: CabinProp;
}

function CabinRow({ cabin }: CabinRowProps) {
  const {
    id: cabinId,
    name,
    maxCapacity,
    discount,
    regularPrice,
    image,
    description,
  } = cabin;

  const { isDeleting, deleteCabin } = useDeleteCabin();
  const { createCabin } = useCreateCabin();

  function handleDuplicate() {
    createCabin({
      name: `Copy of ${name}`,
      maxCapacity,
      discount,
      regularPrice,
      image: image!,
      description,
    });
  }

  return (
    <Table.Row>
      <Modal>
        <Modal.Open opens="cabin-image">
          <Img src={image ?? undefined} loading="lazy" />
        </Modal.Open>
        <Modal.Window name="cabin-image">
          <img
            src={image ?? undefined}
            style={{ width: "100%", objectFit: "contain" }}
          />
        </Modal.Window>
      </Modal>
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity} guests</div>
      <Price>{formatCurrency(regularPrice)}</Price>
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={String(cabinId)} />

            <Menus.List id={String(cabinId)}>
              <Menus.Button icon={<HiSquare2Stack />} onClick={handleDuplicate}>
                Duplicate
              </Menus.Button>

              <Modal.Open opens="Edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="Edit">
              <CreateCabinForm cabinToEdit={cabin} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName={name!}
                disabled={isDeleting}
                onConfirm={() => deleteCabin(cabinId)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default CabinRow;
