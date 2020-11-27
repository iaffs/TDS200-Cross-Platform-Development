import IRatings from "./IRatings";

interface IRatingsList {
    posts_by_pk: {
        ratings: IRatings[];
    }
}

export default IRatingsList;