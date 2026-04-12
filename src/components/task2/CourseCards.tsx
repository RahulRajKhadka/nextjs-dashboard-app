"use client";

import { useState, useRef, useLayoutEffect } from "react";
import CourseCard from "./CourseCard";
import { courseCardsData } from "./courseCardsData";
import gsap from "gsap";

export default function CourseCards() {
  const [expandedId, setExpandedId] = useState<number>(1);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedWidth = useRef(0);
  const collapsedWidth = useRef(0);
  const isAnimating = useRef(false);

  const labelElements = useRef<Map<number, HTMLDivElement>>(new Map());
  const numberElements = useRef<Map<number, HTMLDivElement>>(new Map());
  const iconElements = useRef<Map<number, (HTMLSpanElement | null)[]>>(new Map());

  const getLabelPosition = (courseId: number) => {
    const label = labelElements.current.get(courseId);
    const number = numberElements.current.get(courseId);
    if (!label || !number) return null;

    const labelRect = label.getBoundingClientRect();
    const numberRect = number.getBoundingClientRect();

    const targetX =
      numberRect.right + 16 - (labelRect.left + labelRect.width / 2);
    const targetY =
      numberRect.top + numberRect.height / 2 -
      (labelRect.top + labelRect.height / 2);

    return { label, targetX, targetY };
  };

  // calculate dynamic widths based on container
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalWidth = container.clientWidth;
    const gap = 16;
    const totalGap = gap * (courseCardsData.length - 1);
    const unit = (totalWidth - totalGap) / courseCardsData.length;

    expandedWidth.current = unit * 1.4;
    collapsedWidth.current = unit * 0.6;

    cardRefs.current.forEach((el, i) => {
      if (el) {
        gsap.set(el, {
          width:
            courseCardsData[i].id === expandedId
              ? expandedWidth.current
              : collapsedWidth.current,
        });
      }
    });
  }, []);

  // initial label positioning (collapsed → rotated, expanded → visible)
  useLayoutEffect(() => {
    courseCardsData.forEach((course) => {
      const label = labelElements.current.get(course.id);
      if (label) {
        gsap.set(label, {
          rotation: -90,
          x: 0,
          y: 0,
          color: course.textColor,
        });
      }
    });

    const pos = getLabelPosition(1);
    if (!pos) return;

    gsap.set(pos.label, {
      rotation: 0,
      x: 40,
      y: 180,
      color: "#ffffff",
    });
  }, []);

  const setLabelRef = (id: number) => (el: HTMLDivElement | null) => {
    if (el) labelElements.current.set(id, el);
    else labelElements.current.delete(id);
  };

  const setNumberRef = (id: number) => (el: HTMLDivElement | null) => {
    if (el) numberElements.current.set(id, el);
    else numberElements.current.delete(id);
  };

  const setIconsRef = (id: number) => (els: (HTMLSpanElement | null)[]) => {
    iconElements.current.set(id, els);
  };

  const handleClick = (courseId: number) => {
    if (courseId === expandedId || isAnimating.current) return;

    const prevIndex = courseCardsData.findIndex(
      (c) => c.id === expandedId
    );
    const newIndex = courseCardsData.findIndex(
      (c) => c.id === courseId
    );

    const newCourse = courseCardsData[newIndex];

    const oldLabel = labelElements.current.get(expandedId);
    const oldNumber = numberElements.current.get(expandedId);
    const oldIcons = iconElements.current.get(expandedId) ?? [];
    const newLabel = labelElements.current.get(courseId);
    const newNumber = numberElements.current.get(courseId);

    if (!newLabel || !newNumber) return;

    isAnimating.current = true;

    const PRE_PHASE = 1;
    const shrinkBy = collapsedWidth.current * 0.82;
    const growBy = expandedWidth.current * 1.1;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    // pre-animation phase (anticipation + motion setup)
    tl.to(newLabel, {
      rotation: -100,
      duration: PRE_PHASE,
      ease: "power1.inOut",
    }, 0);

    if (oldLabel) {
      tl.to(oldLabel, {
        rotation: 5,
        duration: PRE_PHASE,
        ease: "back.inOut(1.5)",
      }, 0);
    }

    if (oldIcons.length > 0) {
      oldIcons.forEach((icon, i) => {
        if (!icon) return;
        tl.to(icon, {
          x: 40,
          duration: PRE_PHASE * 0.8,
          ease: "back.out(2)",
        }, i * 0.06);
      });
    }

    tl.to(cardRefs.current[newIndex], {
      width: shrinkBy,
      duration: PRE_PHASE,
      ease: "back.inOut(1.5)",
    }, 0);

    tl.to(cardRefs.current[prevIndex], {
      width: growBy,
      duration: PRE_PHASE,
      ease: "back.inOut(1.5)",
    }, 0);

    // main animation phase (state switch + final positions)
    tl.call(() => setExpandedId(courseId), [], PRE_PHASE);

    tl.to(cardRefs.current[newIndex], {
      width: expandedWidth.current,
      duration: 0.7,
      ease: "back.out(1.8)",
    }, PRE_PHASE);

    tl.to(cardRefs.current[prevIndex], {
      width: collapsedWidth.current,
      duration: 0.7,
      ease: "back.out(1.8)",
    }, PRE_PHASE);

    if (oldLabel) {
      tl.to(oldLabel, {
        rotation: -90,
        x: 0,
        y: 0,
        color: newCourse.textColor,
        duration: 0.6,
        ease: "back.out(2)",
      }, PRE_PHASE);
    }

    if (oldIcons.length > 0) {
      tl.set(oldIcons, { x: 0 }, PRE_PHASE);
    }

    if (oldNumber) {
      tl.to(oldNumber, {
        color: newCourse.textColor,
        duration: 0.4,
        ease: "power2.out",
      }, PRE_PHASE);
    }

    const pos = getLabelPosition(courseId);
    if (pos) {
      tl.to(newLabel, {
        rotation: 0,
        x: 40,
        y: 180,
        color: "#ffffff",
        duration: 0.7,
        ease: "power3.out",
      }, PRE_PHASE + 0.15);
    }

    tl.to(newNumber, {
      color: "#ffffff",
      duration: 0.4,
      ease: "power2.out",
    }, PRE_PHASE + 0.15);
  };

  return (
    <div
      ref={containerRef}
      className="flex gap-4 box-border w-full my-8 h-[400px]"
    >
      {courseCardsData.map((course, i) => (
        <div
          key={course.id}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className="shrink-0 my-auto rounded-3xl h-[350px]"
        >
          <CourseCard
            course={course}
            isExpanded={expandedId === course.id}
            isLeftmost={i === 0}
            onClick={() => handleClick(course.id)}
            setLabelRef={setLabelRef(course.id)}
            setNumberRef={setNumberRef(course.id)}
            setIconsRef={setIconsRef(course.id)}
          />
        </div>
      ))}
    </div>
  );
}