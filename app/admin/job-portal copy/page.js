'use client'

import Header from "@/app/components/Header";
import JobForm from "@/app/components/JobForm";
import Loading from "@/app/components/Loading"
import { Button } from "@/components/ui/button"
import { Suspense, useState } from "react"

const Page = () =>
{
    const [ showJobForm, setShowJobForm ] = useState(false);

    return <JobForm showJobForm={showJobForm} setShowJobForm={setShowJobForm}/>
}

const JobPortal = () =>
{

    return(
        <Suspense fallback={<Loading/>}>
            <Page/>
        </Suspense>
    )
}

export default JobPortal