'use client'

import JobForm from "@/app/components/JobForm";
import Loading from "@/app/components/Loading"
import { Button } from "@/components/ui/button"
import { Suspense, useState } from "react"
import Header from "../components/Header";

const Page = () =>
{
    const [ showJobForm, setShowJobForm ] = useState(false);

    return(
        <div className="">
            <Header/>
            <div className="lg:px-[10vw] px-[5vw] py-12 pt-24">
                <JobForm showJobForm={showJobForm} setShowJobForm={setShowJobForm}/>
            </div>
        </div>
    )
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