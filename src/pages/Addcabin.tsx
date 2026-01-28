import Button from "../ui/Button";
import CreateCabinForm from "../features/cabins/CreateCabinForm";
import Modal from "../ui/Modal";

//复合组件模式
function Addcabin() {
  return (
    <div>
      {/*  // 模糊窗口可能多开，需要指定名字 */}
      <Modal>
        {/* 通过按下特定的按钮给名字，然后就能打开相应的窗口 */}
        <Modal.Open opens="cabin-form">
          <Button>Add new cabin</Button>
        </Modal.Open>
        <Modal.Window name="cabin-form">
          <CreateCabinForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default Addcabin;
