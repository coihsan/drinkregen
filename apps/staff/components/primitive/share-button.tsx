"use client";

import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Share } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
    url: string;
}

interface ShareButtonPropsExtended extends ShareButtonProps {
    children?: React.ReactNode;
}

const ShareButton = ({ url,children }: ShareButtonPropsExtended) => {
    const [copy, setCopy] = useState(url);
    const [loading, setLoading] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(copy).then(() => {
            setCopy("Copied!");
            setLoading(true);
            setTimeout(() => {
                setCopy(url);
                setLoading(false);
            }, 1000);
        }).catch(() => {
            setCopy("Failed to copy!");
            setTimeout(() => {
                setCopy(url);
                setLoading(false);
            }, 2000);
        });
    }
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button variant={'ghost'}>
                        <Share />
                        <span className="font-semibold">Share</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share this profile</DialogTitle>
                <DialogDescription>
                    Anyone with this link can view this profile
                </DialogDescription>
                </DialogHeader>
                <div>
                    <Input value={url} readOnly type="text" />
                    <Button onClick={handleCopy} className="mt-2" disabled={loading}>
                        {loading ? "Copying..." : "Copy Link"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default ShareButton;