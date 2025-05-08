"use client";

import { useState, useEffect } from "react";
import { useAuth, withAuth } from "@/contexts/AuthContext";
import {
	FaUser,
	FaEnvelope,
	FaSchool,
	FaGraduationCap,
	FaCalendarAlt,
	FaCheckCircle,
	FaTimesCircle,
	FaEdit,
} from "react-icons/fa";
import Link from "next/link";

function ProfilePage() {
	const { user } = useAuth();
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		class: "",
		phone: "",
	});
	const [updateStatus, setUpdateStatus] = useState({
		success: false,
		message: "",
	});

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				setLoading(true);
				const res = await fetch("/api/profile", { credentials: "include" });
				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					throw new Error(err.error || "Failed to fetch profile");
				}
				const data = await res.json();
				setProfile(data);
				setFormData({
					name: data.name || "",
					email: data.email || "",
					class: data.class || "",
					phone: data.phone || "",
				});
			} catch (err) {
				console.error("Error fetching profile:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchProfile();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error || "Failed to update profile");
			}
			const updated = await res.json();
			setProfile(updated);
			setUpdateStatus({
				success: true,
				message: "Profile updated successfully",
			});
			setIsEditing(false);
			setTimeout(() => setUpdateStatus({ success: false, message: "" }), 3000);
		} catch (err) {
			console.error("Error updating profile:", err);
			setUpdateStatus({ success: false, message: err.message });
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
			</div>
		);
	}

	return (
		<div className="p-4 md:p-6">
			<div className="max-w-3xl mx-auto">
				{/* header and profile content as before */}
				{/* Omitting for brevity; copy existing JSX from page.js */}
			</div>
		</div>
	);
}

export default withAuth(ProfilePage);
