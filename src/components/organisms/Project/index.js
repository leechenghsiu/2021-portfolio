import React, { useEffect } from 'react';
import classnames from 'classnames';
import { useTransition, useSpringRef, animated } from 'react-spring';

import { useModal } from 'models/modal';
import { useProject } from 'models/project';

import SectionTitle from 'components/atoms/SectionTitle';
import ProjectCard from 'components/molecules/ProjectCard';
import ProjectInnerModal from 'components/molecules/ProjectInnerModal';

import styles from './styles.module.scss';

const Section = ({ start, data, sectionTitle, subTitle, last = false }) => {
	const [, { openModal }] = useModal();
	const [, { setTargetProject }] = useProject();

	const transRef = useSpringRef();
	const transitions = useTransition(data, {
		ref: transRef,
		trail: 250,
		from: { opacity: 0, scale: 0.8 },
		enter: { opacity: 1, scale: 1 },
	});

	useEffect(() => {
		if (start) transRef.start();
	}, [start]);

	return (
		<div className={classnames(styles.project, last && styles.last)}>
			<SectionTitle className={styles.sectionTitle} title={sectionTitle}>
				<p>{subTitle}</p>
			</SectionTitle>
			<div className={styles.content} style={{ minHeight: 136 * Math.ceil(data.length / 2) }}>
				{transitions((style, project) => (
					<animated.div className={styles.animated} style={style}>
						<ProjectCard
							key={project.id}
							title={project.title}
							thumbnail={project.thumbnail}
							tag={project.tag}
							onClick={() => {
								openModal({ type: 'project' });
								setTargetProject(project);
							}}
						/>
					</animated.div>
				))}
			</div>
		</div>
	);
};

const Project = ({ hitFlag }) => {
	const [{ projectList }, { fetchProjects }] = useProject();

	useEffect(() => {
		fetchProjects();
	}, []);

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<Section
					start={hitFlag === 'project'}
					data={projectList
						.filter(({ type: projectType }) => projectType === 'student')
						.sort((a, b) => a.weight - b.weight)}
					sectionTitle="Student Projects"
					subTitle="UX/UI designer who loves her job and helps design industry development in Kazakhstan"
				/>
				<Section
					start={hitFlag === 'project'}
					data={projectList
						.filter(({ type: projectType }) => projectType === 'work')
						.sort((a, b) => a.weight - b.weight)}
					sectionTitle="Work Projects"
					subTitle="UX/UI designer who loves her job and helps design industry development in Kazakhstan"
				/>
				<Section
					last
					start={hitFlag === 'project'}
					data={projectList
						.filter(({ type: projectType }) => projectType === 'side')
						.sort((a, b) => a.weight - b.weight)}
					sectionTitle="Side Projects"
					subTitle="UX/UI designer who loves her job and helps design industry development in Kazakhstan"
				/>
			</div>
			<ProjectInnerModal />
		</div>
	);
};

export default Project;
