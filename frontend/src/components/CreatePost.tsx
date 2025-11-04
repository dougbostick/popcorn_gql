import { useState } from 'react';
import { useCreatePostMutation, type CreatePostInput } from '../generated/graphql';

interface CreatePostProps {
  onPostCreated?: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<CreatePostInput>({
    title: '',
    content: '',
    imageUrl: '',
  });

  const [createPost, { loading }] = useCreatePostMutation({
    onCompleted: () => {
      setFormData({ title: '', content: '', imageUrl: '' });
      setIsExpanded(false);
      onPostCreated?.();
    },
    onError: (error) => {
      console.error('Error creating post:', error);
    },
    refetchQueries: ['GetFeed'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) return;

    try {
      await createPost({
        variables: {
          input: {
            title: formData.title.trim(),
            content: formData.content.trim(),
            imageUrl: formData.imageUrl.trim() || undefined,
          },
        },
      });
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleInputChange = (field: keyof CreatePostInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isExpanded) {
    return (
      <div className="card p-4 mb-6">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full text-left text-gray-500 hover:text-gray-700 transition-colors"
        >
          What's on your mind?
        </button>
      </div>
    );
  }

  return (
    <div className="card p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Post title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="mb-4">
          <textarea
            placeholder="What's happening?"
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className="input-field resize-none"
            rows={4}
            required
          />
        </div>

        <div className="mb-6">
          <input
            type="url"
            placeholder="Image URL (optional)"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange('imageUrl', e.target.value)}
            className="input-field"
          />
        </div>

        {formData.imageUrl && (
          <div className="mb-4">
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
              onError={() => handleInputChange('imageUrl', '')}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              setFormData({ title: '', content: '', imageUrl: '' });
            }}
            className="btn-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !formData.title.trim() || !formData.content.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}