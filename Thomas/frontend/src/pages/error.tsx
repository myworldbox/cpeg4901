import useIsClient from '@/common/hooks/useIsClient'
import LoadPage from '@/common/components/LoadPage/loadPage'
import ErrorPage from '@/common/components/ErrorPage/errorPage';
import { useRouter } from 'next/router';


function Error() {
  const isClient = useIsClient();
  if (!isClient) return (<LoadPage />)

  const router = useRouter()
  let status = (router.query.code) ? parseInt(String(router.query.code)) : null
  let description = (router.query.reason) ? String(router.query.reason) : null
  
  if (status && description){
    return (
      <ErrorPage
        status_code = {status} 
        reason = {description}  
      />
    );
  } else if (status) {
    return (
      <ErrorPage
        status_code = {status} 
      />
    );
  } else if (description) {
    return (
      <ErrorPage
        reason = {description}  
      />
    );
  } else {
    return (
      <ErrorPage />
    );
  }
  
}

export default Error;