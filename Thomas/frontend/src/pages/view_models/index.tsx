import withNavigations from '@/modules/withNavigations'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState, useEffect } from 'react'
import verifyLoginAsync from '@/common/api/verifyLoginAsync'
import handleErrorResponse from '@/common/api/handleError'
import MUIDataTable from "mui-datatables";
import axios from 'axios'
import {useRouter} from 'next/router'

function Home({data}: {data: any}) {
  const [mounted, setMounted] = useState(false)
  const [tableData, setTableData] = useState([])
  const router = useRouter()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
    axios({
      method: 'get',
      url: 'http://localhost:4040/model/all',
      headers: {csrfToken: data.csrfToken},
      withCredentials: true,
      timeout: 5000,
    })
    .then((res:any) => {
      const processedData = res.data.map((dataItem:any) => {
        return {
          "ID" : dataItem._id,
          "Name" : dataItem.name,
          "Invested Amount" : dataItem.invested_amount,
          "Current Realized Profit" : dataItem.realisedProfit,
          "Start" : 
          <button onClick={() => console.log("start", dataItem._id) }>
            {(dataItem.started)?'start':'terminate'}
          </button>,
          "Setting": 
          <button onClick={() => router.push({ pathname: `/view_models/${dataItem._id}`, query: { csrfToken: data.csrfToken } }) }>
            View
          </button>
        }
      })
      setTableData(processedData)
    })
    .catch((error) => { console.error(error) })
  }, [])
  if (!mounted) return null
  
  console.log(tableData)
  return (
    <>
      <MUIDataTable
          title={"models"}
          columns={["ID", "Name", "Invested Amount", "Current Realized Profit", "Start", "View"]}
          data={tableData}
          options = {{
            selectableRows: 'none',
          }}
      />
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