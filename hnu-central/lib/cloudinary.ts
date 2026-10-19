import 'server-only'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  api_key: process.env.CLOUDINARY_API_KEY ?? '',
  api_secret: process.env.CLOUDINARY_API_SECRET ?? '',
})

/**
 * Uploads a profile photo buffer to Cloudinary.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadProfilePhoto(fileBuffer: Buffer, folder = 'cf-profiles'): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', transformation: [{ width: 500, height: 500, crop: 'limit' }] },
      (error, result) => {
        if (error) return reject(error)
        resolve(result?.secure_url ?? '')
      }
    )
    upload.end(fileBuffer)
  })
}

/**
 * Deletes a Cloudinary resource by its public_id.
 */
export async function deletePhoto(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
}
