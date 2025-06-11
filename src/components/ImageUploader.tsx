import { ChangeEvent, DragEvent, useState, useCallback, useRef, useEffect } from 'react'
import { Button, Flex, Text, Image } from '@chakra-ui/react'
import { colors } from '@/theme/cssVariables'
import UploadIcon from '@/icons/misc/UploadIcon'
import { isAndroid } from 'react-device-detect'

const ImageUploader = ({
  onImageUpload,
  onError,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif'],
  maxFileSizeInMB = 5,
  maxFiles = 1,
  isDisabled
}: {
  onImageUpload: (file: File) => void
  onError?: (error: string | null) => void
  acceptedFileTypes?: string[]
  maxFileSizeInMB?: number
  maxFiles?: number
  isDisabled?: boolean
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback(
    (file: File): boolean => {
      if (!acceptedFileTypes.includes(file.type)) {
        const message = `Please upload a valid file type: ${acceptedFileTypes.join(', ')}`
        if (onError) onError(message)
        return false
      }

      const fileSizeInMB = file.size / (1024 * 1024)
      if (fileSizeInMB > maxFileSizeInMB) {
        const message = `Image size too large. Try reducing to < ${maxFileSizeInMB}MB.`
        if (onError) onError(message)
        return false
      }
      if (onError) onError(null)
      return true
    },
    [acceptedFileTypes, maxFileSizeInMB, onError]
  )

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return

      if (files.length > maxFiles) {
        const message = `You can upload a maximum of ${maxFiles} file(s)`
        if (onError) onError(message)
        return
      }

      const file = files[0]

      if (validateFile(file)) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        onImageUpload(file)
      }
    },
    [maxFiles, onImageUpload, validateFile, onError]
  )

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isDragging) {
        setIsDragging(true)
      }
    },
    [isDragging]
  )

  const fetchImageFromUrl = useCallback(
    async (url: string) => {
      try {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`)
        }

        const blob = await response.blob()

        const fileExtension = blob.type.split('/')[1] || 'png'
        const fileName = `image_${Date.now()}.${fileExtension}`
        const file = new File([blob], fileName, { type: blob.type })

        if (validateFile(file)) {
          setPreviewUrl(URL.createObjectURL(file))
          onImageUpload(file)
          if (onError) onError(null)
        }
      } catch (error) {
        let errorMessage = 'Failed to load image.'

        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to access this image due to security restrictions. Try saving it first.'
        } else if (error instanceof Error) {
          errorMessage = error.message
        }

        if (onError) onError(errorMessage)
        return false
      }
    },
    [validateFile, onImageUpload, onError]
  )

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        handleFiles(files)
        return
      }
      const availableTypes = Array.from(e.dataTransfer.types)

      if (availableTypes.includes('text/html')) {
        const html = e.dataTransfer.getData('text/html')
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const imgElement = doc.querySelector('img')

        if (imgElement && imgElement.src) {
          fetchImageFromUrl(imgElement.src)
          return
        }
      }

      if (availableTypes.includes('text/plain')) {
        const text = e.dataTransfer.getData('text/plain')
        if (text.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)/i)) {
          fetchImageFromUrl(text)
          return
        }
      }

      if (onError) onError("Couldn't detect a valid image from the dropped content. Try saving the image first.")
    },
    [handleFiles, fetchImageFromUrl, onError]
  )

  const handleFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      handleFiles(files)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [handleFiles]
  )

  const handleSelectClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <Flex
      direction="column"
      py={4}
      bg={colors.backgroundDark}
      borderRadius="12px"
      alignItems="center"
      justifyContent="center"
      transition="all 0.2s"
      cursor="pointer"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleSelectClick}
    >
      <Flex alignItems="center" gap={2} mb={3}>
        {previewUrl ? (
          <Image src={previewUrl} alt="Preview" maxH="200px" maxW="200px" objectFit="contain" borderRadius="8px" />
        ) : (
          <>
            <UploadIcon />
            <Text fontSize="xl" fontWeight="medium" color={colors.lightPurple} opacity={0.5}>
              Drag and drop an image or GIF
            </Text>
          </>
        )}
      </Flex>
      <Button
        variant="outline"
        width="11.25rem"
        isDisabled={isDisabled}
        onClick={(e) => {
          e.stopPropagation()
          handleSelectClick()
        }}
      >
        {previewUrl ? 'Select another file' : 'Select a file'}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        accept={isAndroid ? `${acceptedFileTypes.join(',')},.zip` : acceptedFileTypes.join(',')}
        multiple={maxFiles > 1}
      />
    </Flex>
  )
}

export default ImageUploader
