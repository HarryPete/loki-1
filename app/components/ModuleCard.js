import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Loading from '@/app/components/Loading';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";

const ModuleCard = ({ lecture, index, course }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { title, recording, modules } = lecture;
    const [allModules, setAllModules] = useState(modules ? [...modules] : []);

    async function onSubmit() {
        try 
        {
            setIsLoading(true);
            const url = `/api/lecture/${lecture._id}`;
            const lectureDetails = { modules: allModules }
            const response = await axios.put(url, { lectureDetails });  // Send updated modules
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <Loading />;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="h-6">Modules</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Session {index + 1}</DialogTitle>
                    <DialogDescription>
                        {course?.id?.toUpperCase() || "Course ID Unavailable"}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        onClick={() => setAllModules((prev) => [...prev, ''])}
                        className="h-6 text-xs"
                    >
                        Add
                    </Button>
                    {allModules.length > 0 && (
                        <Button
                            type="button"
                            onClick={() => setAllModules((prev) => prev.slice(0, -1))}
                            className="h-6 text-xs"
                        >
                            Remove
                        </Button>
                    )}
                </div>

                {allModules.length === 0 && <p className='text-muted-foreground text-center md:text-sm text-xs'>No Modules found</p>}

                <div className="space-y-2">
                    {allModules.map((module, i) => (
                        <Input
                            key={i}
                            type="text"
                            value={module}
                            placeholder={`Module ${i + 1}`}
                            onChange={(e) => {
                                const updatedModules = [...allModules];
                                updatedModules[i] = e.target.value;
                                setAllModules(updatedModules);
                            }}
                            className="flex-1 border p-2 md:text-sm text-xs rounded h-12"
                        />
                    ))}
                </div>

                <DialogFooter>
                    {isLoading ? (
                        <Button disabled>
                            <Loader2 className="animate-spin" />
                        </Button>
                    ) : (
                        <Button onClick={onSubmit}>Update</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ModuleCard;
