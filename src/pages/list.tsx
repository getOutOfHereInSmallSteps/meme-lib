import { Card, CardBody, CardFooter } from '@heroui/card';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ExternalLink } from 'lucide-react';
import { Button } from '@heroui/button';

import DefaultLayout from '@/layouts/default';
import { incrementLikes, memesSelectors } from '@/store/memeSlice';
import { RootState } from '@/store';
import { Meme } from '@/types';

export default function ListPage() {
  const dispatch = useDispatch();
  const memes = useSelector((state: RootState) =>
    memesSelectors.selectAll(state.memes)
  );

  const handleLike = (memeId: number) => {
    dispatch(incrementLikes(memeId));
  };

  const handleVisitUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Meme Gallery</h1>

        <div className="w-full max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {memes.map((meme: Meme) => (
              <div
                key={meme.id}
                className="hover:shadow-lg transition-shadow"
              >
                <Card className="h-full">
                  <CardBody className="p-0 overflow-hidden">
                    <img
                      alt={meme.name}
                      className="w-full h-48 object-cover"
                      src={meme.url}
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
                          className="p-1"
                          color="danger"
                          size="sm"
                          variant="ghost"
                          onPress={() => handleLike(meme.id)}
                        >
                          <Heart size={16} />
                        </Button>
                      </div>

                      <Button
                        className="p-1 flex items-center text-gray-600 cursor-pointer"
                        onPress={() => handleVisitUrl(meme.url)}
                      >
                        <ExternalLink size={16} />
                        <span className="ml-1">Visit</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
