import Image from 'next/image';

// ... existing code ...
            {meeting.thumbnailUrl ? (
              <Image
                src={meeting.thumbnailUrl}
                alt={meeting.title}
                width={300}
                height={200}
                className="w-full h-full object-cover"
              />
            ) : (
              // ... existing code ...
            )}
// ... existing code ... 