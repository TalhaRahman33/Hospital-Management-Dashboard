const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
import { notifySessionExpired } from "@/store/authStore";

const getAuthToken = () => {
	if (typeof window === "undefined") {
		return null;
	}

	try {
		const stored = sessionStorage.getItem("authState");
		return stored ? JSON.parse(stored)?.accessToken ?? null : null;
	} catch {
		return null;
	}
};

export const getCurrentUser = async () => {
	const token = getAuthToken();
	const response = await fetch(`${API_BASE_URL}/auth/me`, {
		credentials: "include",
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});

	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		if (response.status === 401 && typeof window !== "undefined") {
			notifySessionExpired();
		}

		throw new Error(data?.message || "Failed to fetch current user");
	}

	return data?.user || data?.data?.user || null;
};
