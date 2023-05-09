import withNavigations from '@/modules/withNavigations'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState, useEffect } from 'react'
import verifyLoginAsync from '@/common/api/verifyLoginAsync'
import handleErrorResponse from '@/common/api/handleError'
import styles from '@/styles/pages/AdminDashboard.module.css'
import Link from 'next/link'

import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function Home({data}: {data: any}) {
    const { t } = useTranslation('common')
    const router = useRouter()
    const changeTo = router.locale === 'en' ? 'tc' : router.locale === 'tc' ? 'sc' : 'en'
    const [mounted, setMounted] = useState(false)
    const formik = useFormik({
        initialValues: {
            name: 'thomas.fung@fundingreach.com',
            type: 'DayTrade',
            strategy: 'PairTrade',
            requiredStocks: [],
            startDate: '2023-03-13',
            addonNews: 0
        },
        onSubmit: (values) => {
            var url = 'invoice/pdf?'
            const query = { plan:values.plan, promocode:values.promocode, dtStart: values.startDate, addonNews:Boolean(values.addonNews), customerEmail: values.email}
            for (const [key, value] of Object.entries(query)) {
                url += key
                url += '='
                url += value
                url += '&'
            }
            url = url.slice(0, -1)
            alert(url)
            const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
            if (newWindow) newWindow.opener = null
        }
    });
    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) return null

    const tempColorSetting = {
        "& input": {
            color: 'white',
        },
        "& .MuiFormLabel-root": {
            color: 'white',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
        },
        mb: 4
    }
    return (
        <div className={styles.dashbaord}>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                fullWidth
                id="email"
                sx={tempColorSetting}
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                />

                <InputLabel id="plan-label" sx={{"&": { color: 'white'}}}>Plan</InputLabel>
                <Select
                fullWidth
                    labelId="plan-label"
                    id="plan"
                    value={formik.values.plan}
                    name="plan"
                    label="plan"
                    onChange={formik.handleChange}
                    sx={{
                        "& select": {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-input': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        mb: 4
                    }}
                >
                    <MenuItem value={'Premium'}>Premium</MenuItem>
                    <MenuItem value={'PremiumPro'}>PremiumPro</MenuItem>
                    <MenuItem value={'PremiumGold'}>PremiumGold</MenuItem>
                </Select>
                
                <TextField
                fullWidth
                id="promocode"
                sx={tempColorSetting}
                name="promocode"
                label="promocode"
                value={formik.values.promocode}
                onChange={formik.handleChange}
                />
                <TextField
                fullWidth
                id="startDate"
                sx={tempColorSetting}
                name="startDate"
                label="startDate"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                />
                <InputLabel id="addonNews-label" sx={{"&": { color: 'white'}}}>AI Compliance News Alerts</InputLabel>
                <Select
                fullWidth
                    labelId="addonNews-label"
                    id="addonNews"
                    value={formik.values.addonNews}
                    name="addonNews"
                    label="addonNews"
                    onChange={formik.handleChange}
                    sx={{
                        "& select": {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-input': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        mb: 4
                    }}
                >
                    <MenuItem value={1}>Include</MenuItem>
                    <MenuItem value={0}>Not Include</MenuItem>
                </Select>
                <Link href={{ pathname: 'invoice/pdf', }} target="_blank">
                    <Button color="primary" variant="contained" fullWidth type="submit">
                        Generate Invoice
                    </Button>
                </Link>
            </form>
        </div>
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

export default withNavigations(Home, 'Add Model');