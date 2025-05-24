
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Image as ImageIcon, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

function AddMissingPerson() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    lastSeen: "",
    description: "",
    contact: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image) {
      toast({
        title: "Image Required",
        description: "Please upload an image of the missing person.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image to Supabase Storage
      const file = formData.image;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: imageData, error: imageError } = await supabase.storage
        .from('missing-people-images')
        .upload(filePath, file);

      if (imageError) throw imageError;

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('missing-people-images')
        .getPublicUrl(filePath);

      // Insert record into the database
      const { data, error } = await supabase
        .from('missing_people')
        .insert([
          {
            name: formData.name,
            age: parseInt(formData.age),
            last_seen: formData.lastSeen,
            description: formData.description,
            contact: formData.contact,
            image_url: publicUrl,
            status: 'active'
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Report Submitted",
        description: "The missing person report has been successfully submitted.",
      });

      navigate("/find");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit the report. Please try again.",
        variant: "destructive"
      });
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: null }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6">Report Missing Person</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium mb-2">Photo</label>
          <div className="flex items-center justify-center w-full">
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div className="relative w-full h-64">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <Input
            required
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Age</label>
          <Input
            required
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter age"
            min="0"
            max="120"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Last Seen</label>
          <Input
            required
            type="text"
            name="lastSeen"
            value={formData.lastSeen}
            onChange={handleChange}
            placeholder="Location or date last seen"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Input
            required
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Physical description, clothing, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Contact Information</label>
          <Input
            required
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Your contact information"
          />
        </div>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

export default AddMissingPerson;
