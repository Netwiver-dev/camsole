import db from "../../lib/mongodb";
import { Class, User } from "../../lib/models";
import { authenticate } from "../../lib/auth";

export async function POST(req) {
	await db;

	// Authentication check
	const authResult = await authenticate(req, ["admin", "teacher"]);
	if (!authResult.authenticated) {
		return new Response(JSON.stringify({ error: authResult.error }), {
			status: authResult.status,
		});
	}

	const { name, description } = await req.json();

	// Check if class already exists
	const existingClass = await Class.findOne({ name });
	if (existingClass) {
		return new Response(
			JSON.stringify({ error: "Class with this name already exists" }),
			{ status: 400 }
		);
	}

	// Create new class
	const newClass = await Class.create({
		name,
		description,
		createdBy: authResult.user._id,
	});

	return new Response(JSON.stringify(newClass), { status: 201 });
}

export async function GET(req) {
	await db;

	// Authentication check
	const authResult = await authenticate(req);
	if (!authResult.authenticated) {
		return new Response(JSON.stringify({ error: authResult.error }), {
			status: authResult.status,
		});
	}

	const { searchParams } = new URL(req.url);
	const classId = searchParams.get("id");

	if (classId) {
		// Get single class
		const classDoc = await Class.findById(classId);
		if (!classDoc) {
			return new Response(JSON.stringify({ error: "Class not found" }), {
				status: 404,
			});
		}
		return new Response(JSON.stringify(classDoc), { status: 200 });
	} else {
		// Get all classes
		const classes = await Class.find();
		return new Response(JSON.stringify(classes), { status: 200 });
	}
}

export async function PUT(req) {
	await db;

	// Authentication check
	const authResult = await authenticate(req, ["admin", "teacher"]);
	if (!authResult.authenticated) {
		return new Response(JSON.stringify({ error: authResult.error }), {
			status: authResult.status,
		});
	}

	const { id, name, description } = await req.json();

	// Check if class exists
	const classDoc = await Class.findById(id);
	if (!classDoc) {
		return new Response(JSON.stringify({ error: "Class not found" }), {
			status: 404,
		});
	}

	// Update class
	classDoc.name = name || classDoc.name;
	classDoc.description = description || classDoc.description;
	await classDoc.save();

	return new Response(JSON.stringify(classDoc), { status: 200 });
}

export async function DELETE(req) {
	await db;

	// Authentication check
	const authResult = await authenticate(req, ["admin"]);
	if (!authResult.authenticated) {
		return new Response(JSON.stringify({ error: authResult.error }), {
			status: authResult.status,
		});
	}

	const { searchParams } = new URL(req.url);
	const classId = searchParams.get("id");

	if (!classId) {
		return new Response(JSON.stringify({ error: "Class ID is required" }), {
			status: 400,
		});
	}

	// Delete class
	await Class.findByIdAndDelete(classId);

	return new Response(
		JSON.stringify({ message: "Class deleted successfully" }),
		{ status: 200 }
	);
}
