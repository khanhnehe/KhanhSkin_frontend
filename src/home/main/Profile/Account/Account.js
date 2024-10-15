import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../../../../store/action/userThunks';

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.root.user.userInfo);

  useEffect(() => {
    dispatch(getUserById());
  }, [dispatch]);

  return (
    <div className="container">
      <div className="row">
        {/* Cột bên trái */}
        <div className="left col-4">
          {profile && (
            <div className="profile-image">
              <img
                src={profile.image}
                alt={profile.fullName}
                style={{ width: '100%', borderRadius: '50%' }}
              />
            </div>
          )}
        </div>

        {/* Cột bên phải */}
        <div className="right col-8">
          {profile && (
            <div className="profile-details">
              <h2>{profile.fullName}</h2>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Số điện thoại:</strong> {profile.phoneNumber}</p>
              <p><strong>Vai trò:</strong> {profile.role === 2 ? 'Admin' : 'User'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
