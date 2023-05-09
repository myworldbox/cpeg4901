import React from 'react'
import Sidebar from '@/common/components/Sidebar/sidebar'
import { MdBackupTable, MdBookmark, MdBookmarkAdd, MdBuild } from 'react-icons/md'; // React Icons
import styles from '@/styles/modules/withNavigations.module.css'
const CustomeSidebar = ({csrfToken} : {csrfToken: string}) => {
    return (
        <Sidebar
            csrfToken={csrfToken}
            menuItems = {[
                { title: "Dashboard", icon: <MdBackupTable />, route: "/"},
                { title: "Add Models", icon: <MdBookmark />, route: "/add_model"},
                { title: "View Models", icon: <MdBookmarkAdd />, route: "/view_models"},
                { title: "Settings", icon: <MdBuild />, route: "/settings"},
            ]}
        />
    )
}
export default CustomeSidebar;