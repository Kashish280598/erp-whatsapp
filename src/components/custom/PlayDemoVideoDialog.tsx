import { Button } from '@/components/ui/button';
import { Dialog, DialogType } from '@/components/custom/Dialog';
import VIDEO_ICON from '@/assets/icons/continuous-monitoring-icon.svg'; // Replace with your icon
import { useState } from 'react';
import Loader from '@/components/Loader';

export default function PlayDemoVideoDialog() {
    const [open, setOpen] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    
    // Replace with S3 Video URL
    const VIDEO_URL = 'https://server15700.contentdm.oclc.org/dmwebservices/index.php?q=dmGetStreamingFile/p15700coll2/15.mp4/byte/json';

    const handleClose = () => {
        setOpen(false);
        setIsVideoLoaded(false);
        setHasError(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                if (!val) handleClose();
                else setOpen(true);
            }}
            type={DialogType.DEFAULT}
            icon={<img src={VIDEO_ICON} alt="Play Video" className="h-9 w-9 text-primary" />}
            title="Watch a Quick Demo"
            description="See ERP in action. Learn how to maximize protection in 2 minutes."
            trigger={(
                <Button
                    variant="outline"
                    className="px-3 py-2 text-[13px] leading-5 font-inter font-[600] text-neutral z-1"
                    onClick={() => setOpen(true)}
                >
                    Play Video
                </Button>
            )}
            className="sm:max-w-[650px] !max-h-[95vh] custom-scrollbar overflow-auto"
        >
            {open && <div className="mt-4 w-full aspect-video relative rounded-lg overflow-hidden bg-primary-100">
                {!isVideoLoaded && !hasError && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-primary-100 rounded-lg">
                        <Loader className='h-full rounded-lg' />
                    </div>
                )}

                {hasError ? (
                    <div className="absolute inset-0 flex items-center justify-center z-10 p-6 bg-primary-100 rounded-lg">
                        <p className="text-sm text-center text-error font-medium">
                            Failed to load the video. Please check your network connection or try again later.
                        </p>
                    </div>
                ) : (
                    <video
                        width="100%"
                        height="100%"
                        controls
                        onCanPlay={() => setIsVideoLoaded(true)}
                        onError={() => setHasError(true)}
                        className="min-h-full rounded-lg border object-cover block"
                        controlsList="nodownload noplaybackrate"
                        disablePictureInPicture
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        <source
                            src={VIDEO_URL}
                            type="video/mp4"
                        />
                        <track kind="captions" label="English" srcLang="en" default src={VIDEO_URL}/>

                        {/* Basic Fallback */}
                        <p className="p-4 text-center text-sm text-neutral-500">
                            Your browser does not support HTML5 video. Please try updating your browser or download the video from
                            <a
                                href={VIDEO_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline ml-1"
                            >
                                this link
                            </a>.
                        </p>
                    </video>
                )}
            </div>
            }
        </Dialog>
    );
}
