'use client';

import React, {
  startTransition,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/Command';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Prisma, Subreddit } from '@prisma/client';
import { Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';

type SearchResponse = (Subreddit & {
  _count: Prisma.SubredditCountOutputType;
})[];

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [input, setInput] = useState('');

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setInput('');
  }, [pathname]);

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ['search', input],
    queryFn: async () => {
      if (!input || input.trim() === '') return;
      const { data } = await axios.get<SearchResponse>(
        `/api/search?q=${input}`,
      );
      return data;
    },
    enabled: false,
  });

  return (
    <Command className="relative rounded-lg border max-w-lg z-50 overflow-visible">
      <CommandInput
        value={input}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
        className="outline-none border-none focus:border-none focus:outline-none ring-0 "
        placeholder="커뮤니티를 검색하세요."
      />

      {input.length > 0 && (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 && (
            <CommandGroup>
              {queryResults?.map((subreddit) => (
                <CommandItem
                  key={subreddit.id}
                  value={subreddit.name}
                  onSelect={(e) => {
                    startTransition(() => {
                      router.push(`/r/${e}`);
                      router.refresh();
                    });
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  );
}
