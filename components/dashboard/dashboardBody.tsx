
import { useState } from "react";
import styles from "./dashboardBody.module.scss";
import DashboardHeader from "./dashboardHeader";

type dashboardBodyType = {
    id: string
    name: string
    email: string
}

export default function DashboardBody(props: dashboardBodyType) {
    const [basePath, setBasePath] = useState("")
    return <div className={styles.dashboardBody}>
        <DashboardHeader basePath={basePath}/>
    </div>
}