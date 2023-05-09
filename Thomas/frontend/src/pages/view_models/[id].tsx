import withNavigations from '@/modules/withNavigations'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState, useEffect } from 'react'
import verifyLoginAsync from '@/common/api/verifyLoginAsync'
import handleErrorResponse from '@/common/api/handleError'
import axios from 'axios'
import { useSearchParams } from 'next/navigation';

import OverviewCard from '@/common/components/OverviewCard'
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { OverviewSales } from '@/common/components/OverviewCard/overview-sales';
import { OverviewTraffic } from '@/common/components/OverviewCard/overview-traffic';

function Home({data}: {data: any}) {
  const [mounted, setMounted] = useState(false)
  const [modelData, setModelData] = useState([])
  const searchParams = useSearchParams()
  const model_id = searchParams.get('id');

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
    axios({
      method: 'get',
      url: `http://localhost:4040/model/${model_id}`,
      headers: {csrfToken: data.csrfToken},
      withCredentials: true,
      timeout: 5000,
    })
    .then((res:any) => {
      setModelData(res.data)
    })
    .catch((error) => { console.error(error) })
  }, [])
  if (!mounted) return null
  
  console.log(modelData)
  return (
    <>
    <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8
          }}
        >
          <Container maxWidth="xl">
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                sm={6}
                lg={3}
              >
                <OverviewCard
                  title={'Realised PnL'}
                  difference={12.2}
                  negative
                  sx={{ height: '100%' }}
                  value="-$0.6k"
                />
              </Grid>
              <Grid
                xs={12}
                sm={6}
                lg={3}
              >
                <OverviewCard
                  title={'Unrealised PnL'}
                  difference={16.7}
                  positive={false}
                  sx={{ height: '100%' }}
                  value="0.3k"
                />
              </Grid>
              <Grid
                xs={12}
                sm={6}
                lg={3}
              >
                <OverviewCard
                  title={'Standard Deviation'}
                  difference={3.2}
                  positive
                  sx={{ height: '100%' }}
                  value="1.39"
                />
              </Grid>
              <Grid
                xs={12}
                sm={6}
                lg={3}
              >
                <OverviewCard
                  title={'Current Status'}
                  sx={{ height: '100%' }}
                  value="Started"
                />
              </Grid>
              <Grid
                xs={12}
                lg={8}
              >
                <OverviewSales
                  chartSeries={[
                    {
                      name: 'This year',
                      data: [-3, -1.3, 3, -1.2]
                    }
                  ]}
                  sx={{ height: '100%' }}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
                lg={4}
              >
                <OverviewTraffic
                  chartSeries={[63, 37]}
                  labels={['QQQQ', 'S&P500']}
                  sx={{ height: '100%' }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box> 
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