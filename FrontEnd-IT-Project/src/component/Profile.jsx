import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../gobal/UserAuthContext';
import axios from 'axios';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const { user, loading: userLoading } = useUserAuth();

  const fetchUserProfile = async () => {
    try {
      if (!user || !user.id) {
        throw new Error('User is not authenticated or no user ID available.');
      }
      const response = await axios.get(`http://localhost:8080/api/v1/healthinfo/${user.id}`);
      setUserProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    if (!userLoading && user && user.id) {
      fetchUserProfile();
    }
  }, [user, userLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const dataToUpdate = new FormData();
      dataToUpdate.append('first_name', formData.first_name);
      dataToUpdate.append('last_name', formData.last_name);
      dataToUpdate.append('email', formData.email);
      dataToUpdate.append('phone_number', formData.phone_number);
      dataToUpdate.append('address', formData.address);
      dataToUpdate.append('age', formData.age ? parseInt(formData.age, 10) : null);
      dataToUpdate.append('weight', formData.weight ? parseFloat(formData.weight) : null);
      dataToUpdate.append('height', formData.height ? parseFloat(formData.height) : null);
      dataToUpdate.append('gender', formData.gender);

      if (profileImage) {
        dataToUpdate.append('profile_image', profileImage);
      }

      const response = await axios.put(
        `http://localhost:8080/api/v1/healthinfo/${user.id}`,
        dataToUpdate,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUserProfile(response.data);
      setIsEditing(false);
      alert('Profile updated successfully');
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      alert('Failed to update profile');
    }
  };

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height) / 100;
    return (weight / (height * height)).toFixed(2);
  };

  const calculateTDEE = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age, 10);
    const gender = formData.gender;

    let BMR;
    if (gender === 'Male') {
      BMR = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      BMR = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    const activityLevel = 1.55;
    return (BMR * activityLevel).toFixed(2);
  };

  if (userLoading || !userProfile) {
    return <div className='bg-black min-h-screen flex justify-center items-center text-white p-8'>Loading...</div>;
  }

  return (
    <div className='bg-[#f1eeee]  text-black p-8'> 
      <div className='max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg'>
        <h1 className='text-4xl font-bold mb-8 text-center'>FIXMAX-PERFORMANCE PROFILE</h1>
        <div className='flex items-center space-x-8'>
          <div className='flex-shrink-0'>
            {userProfile.profile_image ? (
              <img
                src={`http://localhost:8080${userProfile.profile_image}`}
                alt={userProfile.profile_image}
                className="w-40 h-40 rounded-full object-cover"
              />
            ) : (
              <p>No profile image</p>
            )}
            {isEditing && (
              <input type="file" name="profile_image" onChange={handleImageChange} className="mt-4" />
            )}
          </div>
          <div className='space-y-4'>
            <div className='flex flex-col'>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-200 rounded-lg"
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-200 rounded-lg mt-4"
                  />
                </>
              ) : (
                <h2 className='text-3xl font-bold'>{userProfile.first_name} {userProfile.last_name}</h2>
              )}
            </div>
            <div>
              {isEditing ? (
                <>
                  <label><strong>Email:</strong></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-200 rounded-lg mt-2"
                  />
                  <label><strong>Phone:</strong></label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number || ''}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-200 rounded-lg mt-2"
                  />
                  <label><strong>Address:</strong></label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-200 rounded-lg mt-2"
                  />
                </>
              ) : (
                <>
                  <p>Email: {userProfile.email}</p>
                  <p>Phone: {userProfile.phone_number}</p>
                  <p>Address: {userProfile.address}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className='mt-8'>
          <h2 className='text-2xl font-bold mb-4'>Health Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <label><strong>Height:</strong></label>
              {isEditing ? (
                <input
                  type="text"
                  name="height"
                  value={formData.height || ''}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-200 rounded-lg"
                />
              ) : (
                <p>{userProfile.height} cm</p>
              )}
            </div>
            <div>
              <label><strong>Weight:</strong></label>
              {isEditing ? (
                <input
                  type="text"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-200 rounded-lg"
                />
              ) : (
                <p>{userProfile.weight} kg</p>
              )}
            </div>
            <div>
              <label><strong>Age:</strong></label>
              {isEditing ? (
                <input
                  type="text"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-200 rounded-lg"
                />
              ) : (
                <p>{userProfile.age}</p>
              )}
            </div>
            <div>
              <label><strong>Gender:</strong></label>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-200 rounded-lg"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p>{userProfile.gender}</p>
              )}
            </div>
          </div>

          <div className='mt-8'>
            <h2 className='text-2xl font-bold mb-4'>Calculated Information</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p><strong>BMI:</strong> {calculateBMI()} kg/m²</p>
              </div>
              <div>
                <p><strong>TDEE:</strong> {calculateTDEE()} kcal</p>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 flex space-x-4 justify-center'>
          {isEditing ? (
            <>
              <button onClick={handleSave} className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg'>Save</button>
              <button onClick={() => setIsEditing(false)} className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg'>Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'>Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
