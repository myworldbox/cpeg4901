import withNavigations from '@/modules/withNavigations'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import verifyLoginAsync from '@/common/api/verifyLoginAsync'
import handleErrorResponse from '@/common/api/handleError'

function Home({data}: {data: any}) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const changeTo = router.locale === 'en' ? 'tc' : router.locale === 'tc' ? 'sc' : 'en'
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null
  
  return (
    <>
      <p>
        {t('common.example')}
        <Link 
          href={{
            pathname: '/',
            query: { csrfToken: data.csrfToken },
          }} 
          as={'/'}
          locale={changeTo}>
          <button>{t('change-locale', { changeTo })}</button>
        </Link>
        <select value={theme} onChange={e => setTheme(e.target.value)}>
          <option value="system">System</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </p>
    </>
  )
}

export async function getServerSideProps({ req, res, query, locale }: {req: any, res: any, query: any, locale: any}) {
  const {data, error} = await verifyLoginAsync(query.csrfToken, req.headers.cookie)
  const translation = await serverSideTranslations(locale, ['common'])
  if (error) return handleErrorResponse(error, data)

  return {
    props: {
      ...translation,
      data
    }  
  };
}

export default withNavigations(Home, 'Dashboard');