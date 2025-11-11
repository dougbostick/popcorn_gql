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
    refetchQueries: ['GetFeed', 'GetPosts', 'GetMe'],
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
            imageUrl: formData.imageUrl?.trim() || undefined,
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
      <div style={{
        backgroundColor: 'white',
        padding: '16px',
        marginBottom: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e4e6eb'
      }}>
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            width: '100%',
            textAlign: 'left',
            color: '#65676b',
            fontSize: '15px',
            padding: '12px',
            backgroundColor: '#f0f2f5',
            border: 'none',
            borderRadius: '24px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e4e6eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
        >
          What's on your mind?
        </button>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      marginBottom: '20px',
      borderRadius: '8px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e4e6eb'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#050505',
        marginBottom: '16px'
      }}>
        Create a post
      </h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Post title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '15px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#4267B2'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#ccc'}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <textarea
            placeholder="What's happening?"
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '15px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              outline: 'none',
              resize: 'vertical',
              minHeight: '100px',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#4267B2'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#ccc'}
            rows={4}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <input
            type="url"
            placeholder="Image URL (optional)"
            value={formData.imageUrl || ''}
            onChange={(e) => handleInputChange('imageUrl', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '15px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#4267B2'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#ccc'}
          />
        </div>

        {formData.imageUrl && (
          <div style={{ marginBottom: '16px' }}>
            <img
              src={formData.imageUrl}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '200px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
              onError={() => handleInputChange('imageUrl', '')}
            />
          </div>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              setFormData({ title: '', content: '', imageUrl: '' });
            }}
            style={{
              padding: '10px 20px',
              fontSize: '15px',
              fontWeight: '600',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#65676b',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !formData.title.trim() || !formData.content.trim()}
            style={{
              padding: '10px 20px',
              fontSize: '15px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: loading || !formData.title.trim() || !formData.content.trim()
                ? '#ccc'
                : '#4267B2',
              color: 'white',
              cursor: loading || !formData.title.trim() || !formData.content.trim()
                ? 'not-allowed'
                : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              if (!loading && formData.title.trim() && formData.content.trim()) {
                e.currentTarget.style.backgroundColor = '#365899';
              }
            }}
            onMouseOut={(e) => {
              if (!loading && formData.title.trim() && formData.content.trim()) {
                e.currentTarget.style.backgroundColor = '#4267B2';
              }
            }}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}