import { useState } from "react";

type Props = {
  userData: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  onSave: (data: {
    name: string;
    address: string;
    phone: string;
    email: string;
    password?: string;
  }) => void;
};

function EditeUserForm({ userData, onSave }: Props) {
  const [formData, setFormData] = useState({ ...userData, password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedData = {
      name: formData.name.trim() || userData.name,
      address: formData.address.trim() || userData.address,
      phone: formData.phone.trim() || userData.phone,
      email: formData.email.trim() || userData.email,
    };

    if (formData.password.trim()) {
      onSave({ ...updatedData, password: formData.password });
    } else {
      onSave(updatedData);
    }
  };
  

  return (
    <div className="edit-user-form p-4 bg-light rounded shadow">
      <h3 className="mb-4">Edit Your Information</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">New Password (optional)</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">Save</button>
      </form>
    </div>
  );
}
export default EditeUserForm;

