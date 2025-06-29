// utils/RatingUtils.ts

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fullStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";




export function renderStars(rating: number) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const stars = [];

    for (let i = 0; i < full; i++) {
        stars.push(
            <FontAwesomeIcon key={`full-${i}`} icon={fullStar} className="text-warning" />
        );
    }

    if (half) {
        stars.push(
            <FontAwesomeIcon key="half" icon={fullStar} className="text-warning opacity-50" />
        );
    }

    while (stars.length < 5) {
        stars.push(
            <FontAwesomeIcon key={`empty-${stars.length}`} icon={emptyStar} className="text-warning" />
        );
    }

    return stars;
}
