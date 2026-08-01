import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../api';
import { toast } from 'sonner';

const CreateTripForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    hostName: '',
    hostUpiId: ''
  });

  const handleChange = (e) => {

// [v11] chore(client): setup index.html with meta tags, title, and apple touch icon
