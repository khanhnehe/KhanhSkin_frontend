import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAddressById, createNewAddress, updatedAddress, deletedAddress } from '../../../../store/action/userThunks';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import './Address.scss';
const Address = () => {
    const dispatch = useDispatch();
    const infoAddress = useSelector(state => state.root.user.address);
    const [data, setData] = useState({
        fullName: '',
        phoneNumber: '',
        provinceId: '',
        province: '',
        districtId: '',
        district: '',
        wardId: '',
        ward: '',
        addressDetail: '',
        isDefault: false
    });
    const [editMode, setEditMode] = useState(false);
    const [addressId, setAddressId] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị modal

    useEffect(() => {
        dispatch(getAddressById());
        fetchProvinces();
    }, [dispatch]);

    const fetchProvinces = async () => {
        try {
            const response = await axios.get('https://provinces.open-api.vn/api/p/');
            setProvinces(response.data);
        } catch (error) {
            toast.error('Failed to fetch provinces');
        }
    };

    const fetchDistricts = async (provinceId) => {
        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceId}?depth=2`);
            setDistricts(response.data.districts);
        } catch (error) {
            toast.error('Failed to fetch districts');
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`);
            setWards(response.data.wards);
        } catch (error) {
            toast.error('Failed to fetch wards');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'provinceId') {
            const selectedProvince = provinces.find(province => province.code === Number(value));
            setData({
                ...data,
                provinceId: value,
                province: selectedProvince ? selectedProvince.name : '',
                districtId: '',
                district: '',
                wardId: '',
                ward: ''
            });
            fetchDistricts(value);
        } else if (name === 'districtId') {
            const selectedDistrict = districts.find(district => district.code === Number(value));
            setData({
                ...data,
                districtId: value,
                district: selectedDistrict ? selectedDistrict.name : '',
                wardId: '',
                ward: ''
            });
            fetchWards(value);
        } else if (name === 'wardId') {
            const selectedWard = wards.find(ward => ward.code === Number(value));
            setData({
                ...data,
                wardId: value,
                ward: selectedWard ? selectedWard.name : ''
            });

            setData({ ...data, [name]: value });

        };
    }

    const handleCreateOrUpdate = async () => {
        try {
            if (editMode) {
                await dispatch(updatedAddress({ id: addressId, data }));
            } else {
                await dispatch(createNewAddress(data));
            }
            setEditMode(false);
            setData({
                fullName: '',
                phoneNumber: '',
                provinceId: '',
                province: '',
                districtId: '',
                district: '',
                wardId: '',
                ward: '',
                addressDetail: '',
                isDefault: false
            });
            setDistricts([]);
            setWards([]);
            setShowModal(false); // Đóng modal sau khi hoàn thành
        } catch (error) {
        }
    };

    const handleEdit = (address) => {
        setEditMode(true);
        setAddressId(address.id);
        setData({
            fullName: address.fullName,
            phoneNumber: address.phoneNumber,
            provinceId: address.provinceId,
            province: address.province,
            districtId: address.districtId,
            district: address.district,
            wardId: address.wardId,
            ward: address.ward,
            addressDetail: address.addressDetail,
            isDefault: address.isDefault
        });
        fetchDistricts(address.provinceId);
        fetchWards(address.districtId);
        setShowModal(true); // Hiển thị modal
    };

    const handleDelete = async (id) => {
        try {
            await dispatch(deletedAddress(id));
        } catch (error) {
            toast.error('Không thể xóa địa chỉ!');
        }
    };

    const handleAddNewAddress = () => {
        setEditMode(false);
        setData({
            fullName: '',
            phoneNumber: '',
            provinceId: '',
            province: '',
            districtId: '',
            district: '',
            wardId: '',
            ward: '',
            addressDetail: '',
            isDefault: false
        });
        setDistricts([]);
        setWards([]);
        setShowModal(true); // Hiển thị modal
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className='container'>
            <div className='address'>
                <Button variant="primary" onClick={handleAddNewAddress}>
                    Thêm địa chỉ
                </Button>


                <h3 className='mt-3'>Danh sách địa chỉ</h3>
                <ul className='list-group'>
                    {infoAddress.map((address) => (
                        <li key={address.id} className='list-group-item mt-3'>
                            <div>
                                <p>Họ và tên: {address.fullName}</p>
                                <p>Số điện thoại: {address.phoneNumber}</p>
                                <p> Đại chỉ: {address.addressDetail}, {address.ward}, {address.district}, {address.province}</p>
                                <p>Địa chỉ chi tiết: {address.addressDetail}</p>
                                <p className='text-info'>{address.isDefault ? '(Địa chỉ mặc định)' : ''}</p>
                                <Button variant="warning" onClick={() => handleEdit(address)} className='mr-2 me-3'>Chỉnh sửa</Button>
                                <Button variant="danger" onClick={() => handleDelete(address.id)} disabled={address.isDefault}>
                                    Xóa
                                </Button>
                                {address.isDefault && <small className="text-muted ml-2 ms-3 me-3">Không thể xóa địa chỉ mặc định</small>}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Modal để thêm/chỉnh sửa địa chỉ */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className='form-group'>
                            <label>Họ và tên</label>
                            <input type='text' name='fullName' value={data.fullName}
                                onChange={(e) => setData({ ...data, fullName: e.target.value })}
                                className='form-control' />
                        </div>
                        <div className='form-group mt-2'>
                            <label>Số điện thoại</label>
                            <input type='text' name='phoneNumber' value={data.phoneNumber} onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
                                className='form-control' />
                        </div>
                        <div className='form-group mt-2'>
                            <label>Tỉnh/Thành phố</label>
                            <select name='provinceId' value={data.provinceId} onChange={handleInputChange} className='form-control'>
                                <option value=''>Chọn tỉnh/ thành phố</option>
                                {provinces.map((province) => (
                                    <option key={province.code} value={province.code}>{province.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='form-group mt-2'>
                            <label>Quận/Huyện</label>
                            <select name='districtId' value={data.districtId} onChange={handleInputChange} className='form-control'>
                                <option value=''>Chọn quận/huyện</option>
                                {districts.map((district) => (
                                    <option key={district.code} value={district.code}>{district.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='form-group mt-2'>
                            <label>Xã/Phường</label>
                            <select name='wardId' value={data.wardId} onChange={handleInputChange} className='form-control'>
                                <option value=''>Chọn xã/phường</option>
                                {wards.map((ward) => (
                                    <option key={ward.code} value={ward.code}>{ward.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='form-group mt-2'>
                            <label>Địa chỉ chi tiết</label>
                            <input
                                type='text'
                                name='addressDetail'
                                value={data.addressDetail}
                                onChange={(e) => setData({ ...data, addressDetail: e.target.value })}
                                className='form-control'
                            />
                        </div>

                        <div className='form-group mt-2'>
                            <label>
                                <input type='checkbox' name='isDefault' checked={data.isDefault} onChange={(e) => setData({ ...data, isDefault: e.target.checked })} />
                                {' '}Chọn làm địa chỉ mặc định
                            </label>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleCreateOrUpdate}>
                        {editMode ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>

    );
};

export default Address;
