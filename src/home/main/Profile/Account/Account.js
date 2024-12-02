import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserById,
  changePasswordUser,
} from "../../../../store/action/userThunks";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import "./Account.scss";
import { updateUserId } from "../../../../store/reducer/userSlice";

const Account = () => {
  const dispatch = useDispatch();
  const Account = useSelector((state) => state.root.user.userInfo);

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // State for password change
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for updating user info
  const [inputData, setInputData] = useState({
    fullName: "",
    email: "",
    image: "",
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  // Error state
  const [error, setError] = useState("");

  // Fetch user info on component mount
  useEffect(() => {
    dispatch(getUserById());
  }, [dispatch]);

  useEffect(() => {
    if (Account) {
      setInputData({
        fullName: Account.fullName,
        email: Account.email,
        image: Account.image,
      });
    }
  }, [Account]);

  // Open/close modals
  const handleShowChangePassword = () => setShowChangePasswordModal(true);
  const handleCloseChangePassword = () => {
    setShowChangePasswordModal(false);
    setError("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setError("");
    setInputData({
      fullName: Account?.fullName || "",
      email: Account?.email || "",
      image: Account?.image || "",
    });
    setSelectedImageFile(null);
  };

  // Change password handler
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      await dispatch(changePasswordUser({ oldPassword, newPassword }));
      handleCloseChangePassword();
    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi khi đổi mật khẩu.");
    }
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "zxis1bvp");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxipaqfep/image/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  // Update user info handler
  const handleUpdateUser = async () => {
    if (!inputData.fullName || !inputData.email) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const formData = new FormData();
    formData.append("FullName", inputData.fullName);
    formData.append("Email", inputData.email);

    if (selectedImageFile) {
      formData.append("ImageFile", selectedImageFile);
    }

    try {
      const response = await dispatch(updateUserId(formData));
      if (response.meta.requestStatus === "fulfilled") {
        setShowEditModal(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thông tin.");
    }
  };

  return (
    <div className="container">
      <div className="accoun">
        <div className="row">
          {/* Left Column */}
          <div className="left col-2">
            {inputData.image && (
              <div className="Account-image">
                <img
                  src={inputData.image}
                  alt={inputData.fullName}
                  style={{ width: "80%", borderRadius: "50%" }}
                />
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="right col">
            {Account && (
              <div className="Account-details">
                <h2>{Account.fullName}</h2>
                <p>
                  <strong>Email:</strong> {Account.email}
                </p>
              </div>
            )}

            <div className="btn btn-outline-success me-3" onClick={handleShowEditModal}>
              Chỉnh sửa thông tin
            </div>
            <div className="btn btn-outline-danger" onClick={handleShowChangePassword}>
              Đổi mật khẩu
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
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
                onChange={(e) => setOldPassword(e.target.value)}
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

      {/* Edit User Info Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ và tên"
                value={inputData.fullName}
                onChange={(e) =>
                  setInputData({ ...inputData, fullName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                value={inputData.email}
                onChange={(e) =>
                  setInputData({ ...inputData, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ảnh đại diện</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImageFile(e.target.files[0])}
              />
            </Form.Group>
            {error && <div className="text-danger">{error}</div>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Account;
