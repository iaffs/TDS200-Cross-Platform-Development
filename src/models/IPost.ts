
interface IPost {
    id: number;
    title: string;
    description: string;
    image_filename: string;
    user: {
        id: string;
        display_name: string;
    };
};

export default IPost;