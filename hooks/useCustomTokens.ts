import { useCallback, useState } from 'react';
import { useMount } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { useRouter } from 'next/router';
import { Token } from 'types/token';
import reduce from 'lodash/reduce';
import { Tokens } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

function normalizeTokens(tkns: Token[]): Tokens {
  const hasNear = tkns.find(item => !item.tokenId);

  const input = hasNear
    ? tkns
    : [
        ...tkns,
        {
          symbol: 'NEAR',
          balance: '',
          decimals: 24,
          tokenId: '',
          icon: '',
          id: 'NEAR',
          price: null,
        },
      ];

  return reduce(
    input,
    (acc, token) => {
      const { tokenId, symbol } = token;

      acc[tokenId || symbol] = token;

      return acc;
    },
    {} as Tokens
  );
}

export function useDaoCustomTokens(): { tokens: Record<string, Token> } {
  const router = useRouter();
  const [tokens, setTokens] = useState<Record<string, Token>>({});

  const prepareTokens = useCallback((tkns: Token[]) => {
    setTokens(normalizeTokens(tkns));
  }, []);

  useMount(() => {
    SputnikHttpService.getAccountTokens(router.query.dao as string)
      .then(data => {
        prepareTokens(data);
      })
      .catch(err => {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: err.message,
        });
      });
  });

  return { tokens };
}

export function useAllCustomTokens(): { tokens: Record<string, Token> } {
  const [tokens, setTokens] = useState<Record<string, Token>>({});

  const prepareTokens = useCallback((tkns: Token[]) => {
    setTokens(normalizeTokens(tkns));
  }, []);

  useMount(() => {
    SputnikHttpService.getTokens({
      limit: 1000,
    }).then(data => {
      prepareTokens(data);
    });
  });

  return { tokens };
}
