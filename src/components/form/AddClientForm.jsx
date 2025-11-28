"use client";
import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import TextArea from "@/components/form/input/TextArea";
import DatePicker from "@/components/form/date-picker";
import { ChevronDownIcon } from "@/icons";
import { TimeIcon } from "../../icons";
import FileInput from "@/components/form/input/FileInput";
import Button from "@/components/ui/button/Button";
import toast from "react-hot-toast";
import useProfileStore from "@/store/profileStore";
import axios from "axios";


export default function AddClientForm() {
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const [form, setForm] = useState({
    name: "",
    gender: "",
    dob: "",
    tob: "",
    phone: "",
    email: "",
    state: "",
    city: "",
    village: "",
    notes: "",
    profilePic: null,
  });

  const { user, loading, error, fetchProfile } = useProfileStore();





  // GENERAL INPUT HANDLER
  const handleInput = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, profilePic: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Astrologer info not loaded yet!");
      return;
    }
    // Frontend validation
    if (!form.name?.trim()) {
      toast.error("Client name is required!");
      return;
    }


    try {
      // Build the payload
      const submitData = {
        ...form,
        astrologerId: user._id,
        astrologerUniqueId: user.astroId,
        address: `${form.village}, ${form.city}, ${form.state}`,  // COMBINED
        profilePic: "", // not sending image
      };

      // Send request via Axios
      const response = await axios.post("/api/clients", submitData, {
        headers: { "Content-Type": "application/json" },
      });

      // If successful
      toast.success("Client added successfully!");

      // Reset form
      setForm({
        name: "",
        gender: "",
        dob: "",
        tob: "",
        phone: "",
        email: "",
        state: "",
        city: "",
        village: "",
        notes: "",
        profilePic: null,
      });

    } catch (error) {
      console.error(error);

      // Axios error handling
      if (error.response) {
        // Backend returned a response with status != 2xx
        toast.error(error.response.data.message || "Something went wrong!");
      } else if (error.request) {
        // Request made but no response received
        toast.error("No response from server. Please try again.");
      } else {
        // Something else went wrong
        toast.error(error.message || "Something went wrong!");
      }
    }
  };




  return (
    <ComponentCard title="Add New Client">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* NAME */}
        <div>
          <Label>Client Name</Label>
          <Input
            type="text"
            placeholder="Enter name"
            value={form.name}
            required
            onChange={(e) => handleInput("name", e.target.value)}
          />
        </div>

        {/* GENDER */}
        <div>
          <Label>Gender</Label>
          <div className="relative">
            <Select
              options={genderOptions}
              placeholder="Select gender"
              onChange={(v) => handleInput("gender", v?.value)} // FIXED
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        {/* TIME OF BIRTH */}
        <div>
          <Label htmlFor="tob">Time of Birth</Label>
          <div className="relative">
            <Input
              type="time"
              id="tob"
              value={form.tob}
              onChange={(e) => handleInput("tob", e.target.value)} // FIXED
            />
            <span className="absolute text-gray-500 right-3 top-1/2 -translate-y-1/2 pointer-events-none dark:text-gray-400">
              <TimeIcon />
            </span>
          </div>
        </div>

        {/* DOB */}
        <div>
          <DatePicker
            id="dob"
            label="Date of Birth"
            placeholder="Select date"
            onChange={(dates, dateStr) => handleInput("dob", dateStr)} // FIXED
          />
        </div>

        {/* PHONE */}
        <div>
          <Label>Phone</Label>
          <Input
            type="tel"
            placeholder="+91 9876543210"
            value={form.phone}
            onChange={(e) => handleInput("phone", e.target.value)}
          />
        </div>

        {/* EMAIL */}
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => handleInput("email", e.target.value)}
          />
        </div>

        {/* STATE */}
        <div>
          <Label>State</Label>
          <Input
            type="text"
            placeholder="Enter state"
            value={form.state}
            onChange={(e) => handleInput("state", e.target.value)}
          />
        </div>

        {/* CITY */}
        <div>
          <Label>City</Label>
          <Input
            type="text"
            placeholder="Enter city"
            value={form.city}
            onChange={(e) => handleInput("city", e.target.value)}
          />
        </div>

        {/* VILLAGE */}
        <div>
          <Label>Village</Label>
          <Input
            type="text"
            placeholder="Enter village/locality"
            value={form.village}
            onChange={(e) => handleInput("village", e.target.value)}
          />
        </div>

        {/* UPLOAD FILE */}
        <div>
          <Label>Upload Profile Picture</Label>
          <FileInput onChange={handleFileChange} className="custom-class" />
        </div>

        {/* DESCRIPTION */}
        <div className="md:col-span-2">
          <Label>Description / Notes</Label>
          <TextArea
            rows={6}
            value={form.notes}
            onChange={(value) => handleInput("notes", value)}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="md:col-span-2 flex justify-end">
          <Button
            size="md"
            variant="primary"
            onClick={handleSubmit}
          >
            Save Client
          </Button>
        </div>


      </div>
    </ComponentCard>
  );
}
