// Usage example for submitting answers at exam end
export async function submitExamResult({ examId, studentName, answers }) {
	const res = await fetch("/api/results", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ examId, studentName, answers }),
	});
	if (!res.ok) throw new Error("Failed to submit result");
	return res.json();
}

// Usage example for fetching result
export async function fetchExamResult({ examId, studentName }) {
	const res = await fetch(
		`/api/results?examId=${examId}&studentName=${encodeURIComponent(
			studentName
		)}`
	);
	if (!res.ok) throw new Error("Result not found");
	return res.json();
}
