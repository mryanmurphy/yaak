import type { HttpResponse } from '@yaakapp-internal/models';
import { useResponseBodyText } from '../hooks/useResponseBodyText';
import { useHttpRequest } from '../hooks/useHttpRequest';
import { LoadingIcon } from './core/LoadingIcon';

interface Props {
  response: HttpResponse;
}

export function ResponseTimeline({ response }: Props) {
  const req = useHttpRequest(response.requestId);
  const res = useResponseBodyText(response);

  if (response.state !== 'closed') {
    return (<LoadingIcon size="xl" className="text-text-subtlest" />);
  }

  const url = new URL(response.url);
  const hostHeaderIndex = response.requestHeaders.findIndex(h => /host/i.test(h.name) && h.value);
  const host = hostHeaderIndex >= 0 ? response.requestHeaders[hostHeaderIndex]!.value : url.hostname;
  const timestamp = Date.parse(response.createdAt+'Z');

  return (
    <div className="overflow-auto h-full pb-4 ">
      <pre className="text-text-subtlest select-text cursor-text">{`
* Preparing request to ${response.url}
* Current time is ${new Date(timestamp)}
* Connected to ${url.hostname} (${response.remoteAddr?.replace(':', ') port ')}
`}</pre>

      <pre className="text-primary select-text cursor-text">{`
> ${req?.method} ${url.pathname}${url.search}${url.hash} ${response.version}
> host: ${host}
> ${response.requestHeaders.filter(h => !/host/i.test(h.name) || !h.value).map(h => `${h.name}: ${h.value}`).join('\n> ')}
`}</pre>

      <pre className="text-info select-text cursor-text">{`
< ${response.version} ${response.status} ${response.statusReason}
< ${response.headers.map(h => `${h.name}: ${h.value}`).join('\n< ')}
< ${res.data}
`}
      </pre>
    </div>
  );
}
