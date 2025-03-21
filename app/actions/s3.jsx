"use server"

import sharp from "sharp"
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
	credentials: {
		accessKeyId: accessKey,
		secretAccessKey: secretAccessKey
	},
	region: bucketRegion
})

// FormData
export async function getProperties(surveyId) {
	const properties = await fetch(`${process.env.DOMAIN}/properties?surveyId=${surveyId}`)
		.then((response) => response.json())
		.then((data) => {
			return data.properties
		})

	for (const property of properties) {
		if (!property.propertyImageKey) {
			continue
		}
		const getObjectParams = {
			Bucket: bucketName,
			Key: property.propertyImageKey
		}

		const command = new GetObjectCommand(getObjectParams)
		const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
		property.s3PresignedUrl = url
	}

	return properties
}
export async function getProperty(propertyId) {
	const property = await fetch(`${process.env.DOMAIN}/property?propertyId=${propertyId}`).then((response) =>
		response.json()
	)

	if (property.propertyImageKey) {
		const getObjectParams = {
			Bucket: bucketName,
			Key: property.propertyImageKey
		}

		const command = new GetObjectCommand(getObjectParams)
		const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
		property.s3PresignedUrl = url
	}

	return property
}
export async function deleteProperty(propertyId) {
	deletePropertyImage(propertyId)
}
export async function createImage(file, propertyId) {
	const buffer = await file.arrayBuffer()

	const fileBuffer = await sharp(buffer).resize({ height: 1920, width: 1080, fit: "contain" }).toBuffer()

	const bucketKey = `${propertyId}-property-image`
	const params = {
		Bucket: bucketName,
		Key: bucketKey,
		Body: fileBuffer,
		ContentType: file.type
	}

	const command = new PutObjectCommand(params)
	await s3.send(command)

	await fetch(`${process.env.DOMAIN}/property`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			propertyId: propertyId,
			updateKey: "propertyImageKey",
			updateValue: bucketKey
		})
	})

	return getProperty(propertyId)
}
export async function deletePropertyImage(propertyId) {
	const bucketKey = `${propertyId}-property-image`
	const params = {
		Bucket: bucketName,
		Key: bucketKey
	}

	const command = new DeleteObjectCommand(params)
	await s3.send(command)
}
