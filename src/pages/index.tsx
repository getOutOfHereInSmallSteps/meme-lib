import DefaultLayout from '@/layouts/default';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@heroui/table';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateMeme, incrementLikes, memesSelectors } from '@/store/memeSlice';
import { RootState } from '@/store';
import { Heart } from 'lucide-react';
import { Meme } from '@/types';

export default function IndexPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedMeme, setSelectedMeme] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', url: '' });
  const [errors, setErrors] = useState({ name: '', url: '' });

  const dispatch = useDispatch();
  const memes = useSelector((state: RootState) =>
    memesSelectors.selectAll(state.memes)
  );

  const onEdit = (memeId: number) => {
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

  const selectedMemeData: Meme | null | undefined =
    selectedMeme !== null
      ? memes.find((m: Meme) => m.id === selectedMeme)
      : null;

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Meme Collection</h1>

        <div className="w-full max-w-4xl rounded-lg shadow-md overflow-hidden">
          <Table
            aria-label="Meme collection table"
            className="w-full"
          >
            <TableHeader>
              <TableColumn className="py-3">ID</TableColumn>
              <TableColumn className="py-3">Name</TableColumn>
              <TableColumn className="py-3">Likes</TableColumn>
              <TableColumn className="py-3">Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {memes.map((meme: Meme) => {
                return (
                  <TableRow key={meme.id}>
                    <TableCell>{meme.id}</TableCell>
                    <TableCell className="font-medium">{meme.name}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() => onEdit(meme.id)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
