import type { Components } from 'react-markdown';

/**
 * Links and images inside rendered library markdown (PB-22). External links open in a new
 * tab, so following one doesn't drop the app's state; `#anchor` links point at the
 * `user-content-` ids rehype-sanitize gives every id, as GitHub does; images load lazily
 * and send no referrer to the hosts READMEs pull them from.
 */
export const markdownComponents: Components = {
  a: ({ node: _node, href, ...props }) => {
    if (href?.startsWith('#')) return <a href={`#user-content-${href.slice(1)}`} {...props} />;
    const external = href !== undefined && /^https?:\/\//i.test(href);
    return <a href={href} {...props} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} />;
  },
  img: ({ node: _node, ...props }) => <img {...props} loading="lazy" referrerPolicy="no-referrer" />,
};
