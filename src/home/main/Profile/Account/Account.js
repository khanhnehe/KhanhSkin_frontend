import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserById, changePasswordUser } from "../../../../store/action/userThunks";
import "./Account.scss";
import { Modal, Button, Form } from "react-bootstrap";

const Account = () => {
  const dispatch = useDispatch();
  const Account = useSelector((state) => state.root.user.userInfo);

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Fetch user info
  useEffect(() => {
    dispatch(getUserById());
  }, [dispatch]);

  // Xử lý mở và đóng modal
  const handleShowChangePassword = () => setShowChangePasswordModal(true);
  const handleCloseChangePassword = () => {
    setShowChangePasswordModal(false);
    setError("");
    setoldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
  
    console.log({ oldPassword, newPassword }); // Kiểm tra dữ liệu trước khi gửi
  
    try {
      await dispatch(changePasswordUser({ oldPassword, newPassword }));
      // alert("Đổi mật khẩu thành công!");
      // handleCloseChangePassword();
    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi khi đổi mật khẩu.");
    }
  };
  

  return (
    <div className="container">
      <div className="accoun">
        <div className="row">
          {/* Cột bên trái */}
          <div className="left col-2">
            {Account && (
              <div className="Account-image">
                <img
                  src={Account.image}
                  alt={Account.fullName}
                  style={{ width: "80%", borderRadius: "50%" }}
                />
              </div>
            )}
          </div>

          {/* Cột bên phải */}
          <div className="right col">
            {Account && (
              <div className="Account-details">
                <h2>{Account.fullName}</h2>
                <p>
                  <strong>Email:</strong> {Account.email}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {Account.phoneNumber}
                </p>
              </div>
            )}

            <div className="btn btn-outline-success me-3">Chỉnh sửa thông tin</div>
            <div className="btn btn-outline-danger" onClick={handleShowChangePassword}>
              Đổi mật khẩu
            </div>
          </div>
        </div>
      </div>

      {/* Modal Đổi Mật Khẩu */}
      <Modal show={showChangePasswordModal} onHide={handleCloseChangePassword}>
        <Modal.Header closeButton>
          <Modal.Title>Đổi Mật Khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu hiện tại</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu hiện tại"
                value={oldPassword}
                onChange={(e) => setoldPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            {error && <div className="text-danger">{error}</div>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseChangePassword}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleChangePassword}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Account;
