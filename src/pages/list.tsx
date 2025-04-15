import DefaultLayout from '@/layouts/default';
import { Card, CardBody, CardFooter } from '@heroui/card';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal';
import { Button, PressEvent } from '@heroui/button';
import { Input } from '@heroui/input';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateMeme, incrementLikes, memesSelectors } from '@/store/memeSlice';
import { RootState } from '@/store';
import { Heart, ExternalLink } from 'lucide-react';
import { Meme } from '@/types';

export default function ListPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedMeme, setSelectedMeme] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', url: '' });
  const [errors, setErrors] = useState({ name: '', url: '' });

  const dispatch = useDispatch();
  const memes = useSelector((state: RootState) =>
    memesSelectors.selectAll(state.memes)
  );

  const onOpenMeme = (memeId: number) => {
    const meme = memes.find((m: Meme) => m.id === memeId);
    if (meme) {
      setSelectedMeme(memeId);
      setFormData({ name: meme.name, url: meme.url });
      setErrors({ name: '', url: '' });
      onOpen();
    }
  };

  const handleLike = (memeId: number) => {
    dispatch(incrementLikes(memeId));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'name') {
      if (value.length < 3 || value.length > 100) {
        setErrors(prev => ({
          ...prev,
          name: 'Name must be between 3 and 100 characters',
        }));
      } else {
        setErrors(prev => ({ ...prev, name: '' }));
      }
    }

    if (name === 'url') {
      try {
        new URL(value);
        setErrors(prev => ({ ...prev, url: '' }));
      } catch (e) {
        setErrors(prev => ({ ...prev, url: 'Please enter a valid URL' }));
      }
    }
  };

  const handleSubmit = () => {
    let valid = true;
    const newErrors = { name: '', url: '' };

    if (formData.name.length < 3 || formData.name.length > 100) {
      newErrors.name = 'Name must be between 3 and 100 characters';
      valid = false;
    }

    try {
      new URL(formData.url);
    } catch (e) {
      newErrors.url = 'Please enter a valid URL';
      valid = false;
    }

    setErrors(newErrors);

    if (valid && selectedMeme !== null) {
      dispatch(
        updateMeme({
          id: selectedMeme,
          changes: { name: formData.name, url: formData.url },
        })
      );
      onOpenChange();
    }
  };

  const handleVisitUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const selectedMemeData: Meme | null | undefined =
    selectedMeme !== null
      ? memes.find((m: Meme) => m.id === selectedMeme)
      : null;

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Meme Gallery</h1>

        <div className="w-full max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {memes.map((meme: Meme) => (
              <Card
                key={meme.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onOpenMeme(meme.id)}
              >
                <CardBody className="p-0 overflow-hidden">
                  <img
                    src={meme.url}
                    alt={meme.name}
                    className="w-full h-48 object-cover"
                    onError={e => {
                      e.currentTarget.src = '/placeholder-image.png';
                      e.currentTarget.alt = 'Image not available';
                    }}
                  />
                </CardBody>
                <CardFooter className="flex flex-col gap-2 p-4">
                  <div className="flex justify-between items-center w-full">
                    <h3 className="font-medium text-lg truncate">
                      {meme.name}
                    </h3>
                    <span className="text-sm text-gray-500">#{meme.id}</span>
                  </div>

                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                      <span>{meme.likes}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        color="danger"
                        className="p-1"
                        onPress={() => handleLike(meme.id)}
                      >
                        <Heart size={16} />
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      variant="light"
                      className="p-1"
                      onPress={e => handleVisitUrl(meme.url, e)}
                    >
                      <ExternalLink size={16} />
                      <span className="ml-1">Visit</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {selectedMemeData && (
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            className="max-w-md"
          >
            <ModalContent>
              {onClose => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Edit Meme
                    <p className="text-sm text-gray-500 font-normal">
                      Update meme details below
                    </p>
                  </ModalHeader>
                  <ModalBody>
                    <form className="flex flex-col gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-1"
                        >
                          Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          isInvalid={!!errors.name}
                          errorMessage={errors.name}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="url"
                          className="block text-sm font-medium mb-1"
                        >
                          Image URL
                        </label>
                        <Input
                          id="url"
                          name="url"
                          value={formData.url}
                          onChange={handleInputChange}
                          isInvalid={!!errors.url}
                          errorMessage={errors.url}
                          className="w-full"
                        />
                      </div>

                      <div className="mt-2">
                        <p className="text-sm font-medium mb-2">Preview</p>
                        {formData.url && !errors.url ? (
                          <img
                            src={formData.url}
                            alt={formData.name}
                            className="w-full h-48 object-contain rounded-md bg-gray-100"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-md">
                            <p className="text-gray-500">Image preview</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-medium">
                          {selectedMemeData.likes} likes
                        </span>
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          onPress={() => handleLike(selectedMemeData.id)}
                          className="flex items-center gap-1"
                        >
                          <Heart size={16} />
                          Like
                        </Button>
                      </div>
                    </form>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onPress={handleSubmit}
                      disabled={!!errors.name || !!errors.url}
                    >
                      Save Changes
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </section>
    </DefaultLayout>
  );
}
